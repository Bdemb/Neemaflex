from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Neemaflex API", description="Multi-service platform API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "neemaflex-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()

# Enums and Constants
USER_ROLES = ["customer", "service_provider", "admin"]
KYC_STATUS = ["pending", "verified", "rejected"]
SERVICE_CATEGORIES = [
    "transport", "delivery", "video_consultation", "home_services", 
    "real_estate", "vehicles", "ticketing", "other"
]

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    phone: str
    first_name: str
    last_name: str
    role: str = Field(..., pattern="^(customer|service_provider|admin)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    address: Optional[Dict] = None

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_active: bool = True
    is_verified: bool = False
    kyc_status: str = "pending"
    profile_picture: Optional[str] = None
    address: Optional[Dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: User

class TokenRefresh(BaseModel):
    refresh_token: str

class ServiceProvider(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_name: str
    business_license: Optional[str] = None
    service_categories: List[str] = []
    description: Optional[str] = None
    rating: float = 0.0
    total_ratings: int = 0
    is_available: bool = True
    verification_status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceProviderCreate(BaseModel):
    business_name: str
    service_categories: List[str]
    description: Optional[str] = None
    business_license: Optional[str] = None

class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    label: str  # home, work, other
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

class AddressCreate(BaseModel):
    label: str
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

# Utility Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    return User(**user)

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def validate_phone(phone: str) -> bool:
    phone_pattern = re.compile(r'^\+?1?\d{9,15}$')
    return phone_pattern.match(phone) is not None

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Validate phone number
    if not validate_phone(user_data.phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number format"
        )
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if phone already exists
    existing_phone = await db.users.find_one({"phone": user_data.phone})
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict.pop("password")
    user_obj = User(**user_dict)
    
    # Store user with hashed password
    user_doc = user_obj.dict()
    user_doc["hashed_password"] = hashed_password
    
    await db.users.insert_one(user_doc)
    
    # Create tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_obj.id}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user_obj.id})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_obj
    )

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_obj = User(**user)
    if not user_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_obj.id}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user_obj.id})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_obj
    )

@api_router.post("/auth/refresh", response_model=Dict[str, str])
async def refresh_token(token_data: TokenRefresh):
    try:
        payload = jwt.decode(token_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# User Management Routes
@api_router.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    return current_user

@api_router.put("/users/me", response_model=User)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"id": current_user.id})
    return User(**updated_user)

# Service Provider Routes
@api_router.post("/service-providers", response_model=ServiceProvider)
async def create_service_provider(
    provider_data: ServiceProviderCreate,
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "service_provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only service providers can create provider profiles"
        )
    
    # Check if provider profile already exists
    existing_provider = await db.service_providers.find_one({"user_id": current_user.id})
    if existing_provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service provider profile already exists"
        )
    
    # Validate service categories
    invalid_categories = [cat for cat in provider_data.service_categories if cat not in SERVICE_CATEGORIES]
    if invalid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid service categories: {invalid_categories}"
        )
    
    provider_dict = provider_data.dict()
    provider_dict["user_id"] = current_user.id
    provider_obj = ServiceProvider(**provider_dict)
    
    await db.service_providers.insert_one(provider_obj.dict())
    return provider_obj

@api_router.get("/service-providers/me", response_model=ServiceProvider)
async def get_my_service_provider_profile(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "service_provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only service providers can access this endpoint"
        )
    
    provider = await db.service_providers.find_one({"user_id": current_user.id})
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service provider profile not found"
        )
    
    return ServiceProvider(**provider)

# Address Management Routes
@api_router.post("/addresses", response_model=Address)
async def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_active_user)
):
    # If this is set as default, unset other default addresses
    if address_data.is_default:
        await db.addresses.update_many(
            {"user_id": current_user.id},
            {"$set": {"is_default": False}}
        )
    
    address_dict = address_data.dict()
    address_dict["user_id"] = current_user.id
    address_obj = Address(**address_dict)
    
    await db.addresses.insert_one(address_obj.dict())
    return address_obj

@api_router.get("/addresses", response_model=List[Address])
async def get_user_addresses(current_user: User = Depends(get_current_active_user)):
    addresses = await db.addresses.find({"user_id": current_user.id}).to_list(100)
    return [Address(**address) for address in addresses]

# Admin Routes
@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users = await db.users.find().to_list(1000)
    return [User(**user) for user in users]

@api_router.get("/admin/service-providers", response_model=List[ServiceProvider])
async def get_all_service_providers(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    providers = await db.service_providers.find().to_list(1000)
    return [ServiceProvider(**provider) for provider in providers]

# Health Check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()