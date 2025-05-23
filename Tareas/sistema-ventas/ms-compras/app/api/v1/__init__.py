from fastapi import APIRouter
from .compra_router import router as compra_router_api

router = APIRouter()
router.include_router(compra_router_api)