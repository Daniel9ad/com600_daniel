from fastapi import APIRouter, Depends, Form, Path, Body
from typing import Annotated, Any, Dict

from app.schemas.response_schema import ResponseSchema
from app.core.security import Auth
from app.enums.roles_enum import Roles
from app.services.compra_service import CompraService
from app.api.dependencies.compra_dependencies import get_compra_service
from app.db.models.compra_model import PurchaseStatus

router = APIRouter()

# Obtener una compra específica por ID
@router.get("/compras/{compra_id}",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN, Roles.CUSTOMER],
        ))
    ]
)
async def find(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    compra_id: int = Path(..., description="ID de la compra")
) -> ResponseSchema:
    return await compra_service.find(compra_id)

# Obtener todas las compras
@router.get("/compras",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN],
        ))
    ]
)
async def find_all(
    compra_service: Annotated[CompraService, Depends(get_compra_service)]
) -> ResponseSchema:
    return await compra_service.find_all()

# Obtener compras por usuario
@router.get("/compras/usuario/{user_id}",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN, Roles.CUSTOMER],
        ))
    ]
)
async def find_by_user(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    user_id: str = Path(..., description="ID del usuario")
) -> ResponseSchema:
    return await compra_service.find_by_user(user_id)

# Crear una nueva compra
@router.post("/compras",
    status_code=201,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN, Roles.CUSTOMER],
        ))
    ]
)
async def create(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    data: Dict[str, Any] = Body(..., description="Datos de la compra en formato JSON")
) -> ResponseSchema:
    print("Create compra data:", data)
    return await compra_service.create(data)

# Actualizar una compra
@router.put("/compras/{compra_id}",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN, Roles.CUSTOMER],
        ))
    ]
)
async def update(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    compra_id: int = Path(..., description="ID de la compra"),
    data: str = Form(..., description="Datos actualizados de la compra en formato JSON")
) -> ResponseSchema:
    return await compra_service.update(compra_id, data)

# Actualizar solo el estado de una compra
@router.patch("/compras/{compra_id}/estado",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN],
        ))
    ]
)
async def update_status(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    compra_id: int = Path(..., description="ID de la compra"),
    status: PurchaseStatus = Form(..., description="Nuevo estado de la compra")
) -> ResponseSchema:
    from app.schemas.compra_schema import PurchaseUpdate
    purchase_update = PurchaseUpdate(status=status)
    return await compra_service.update_status(compra_id, purchase_update)

# Eliminar una compra
@router.delete("/compras/{compra_id}",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN],
        ))
    ]
)
async def delete(
    compra_service: Annotated[CompraService, Depends(get_compra_service)],
    compra_id: int = Path(..., description="ID de la compra")
) -> ResponseSchema:
    return await compra_service.delete(compra_id)

# Obtener total de compras
@router.get("/compras/estadisticas/total",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN],
        ))
    ]
)
async def count_total(
    compra_service: Annotated[CompraService, Depends(get_compra_service)]
) -> ResponseSchema:
    return await compra_service.count_total()

# Obtener resumen de ventas
@router.get("/compras/estadisticas/resumen",
    status_code=200,
    response_model=ResponseSchema,
    dependencies=[
        Depends(Auth(
            allowed_roles=[Roles.ADMIN],
        ))
    ]
)
async def get_sales_summary(
    compra_service: Annotated[CompraService, Depends(get_compra_service)]
) -> ResponseSchema:
    return await compra_service.get_sales_summary()