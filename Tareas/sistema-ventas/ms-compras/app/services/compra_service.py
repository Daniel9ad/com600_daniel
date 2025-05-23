from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.sql import func
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.db.models.compra_model import Compra, PurchaseStatus
from app.schemas.response_schema import ResponseSchema
from app.schemas.compra_schema import CompraCreate, CompraUpdate, PurchaseUpdate
from app.schemas.notification_schema import NotificationMessage
from app.utils.transform import to_dict
from app.services.rabbitmq import publish_message


class CompraService:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def find(self, compra_id: int) -> ResponseSchema:
        """Buscar una compra por ID"""
        compra = (await self.db_session.scalars(
            select(Compra).where(Compra.id == compra_id)
        )).first()
        
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        
        compra_dict = to_dict(compra)
        return ResponseSchema(
            status=True,
            status_code=200,
            message="Compra encontrada",
            data=compra_dict
        )
    
    async def find_all(self) -> ResponseSchema:
        """Obtener todas las compras"""
        compras = (await self.db_session.scalars(
            select(Compra)
        )).all()
        
        compras_dict = [to_dict(compra) for compra in compras]
        return ResponseSchema(
            status=True,
            status_code=200,
            message=f"Se encontraron {len(compras_dict)} compras",
            data=compras_dict
        )
    
    async def find_by_user(self, user_id: str) -> ResponseSchema:
        """Obtener todas las compras de un usuario específico"""
        compras = (await self.db_session.scalars(
            select(Compra).where(Compra.user_id == user_id)
        )).all()
        
        compras_dict = [to_dict(compra) for compra in compras]
        return ResponseSchema(
            status=True,
            status_code=200,
            message=f"Se encontraron {len(compras_dict)} compras para el usuario {user_id}",
            data=compras_dict
        )
    
    async def create(self, data: Dict[str, Any]) -> ResponseSchema:
        """Crear una nueva compra"""
        try:
            # Usar CompraCreate para validar datos de creación (sin id)
            validated_data = CompraCreate(**data)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Datos inválidos: {str(e)}"
            )
        
        print("Creando compra con los siguientes datos:", validated_data)
        
        # Crear nueva compra
        nueva_compra = Compra(
            user_id=validated_data.user_id,
            event_id=validated_data.event_id,
            event_name=validated_data.event_name,
            quantity=validated_data.quantity,
            total_price=validated_data.total_price,
            status=validated_data.status or PurchaseStatus.PENDING,
            purchase_date=validated_data.purchase_date or func.now(),
            payment_date=validated_data.payment_date
        )
        
        try:
            self.db_session.add(nueva_compra)
            await self.db_session.commit()
            await self.db_session.refresh(nueva_compra)
            
            compra_dict = to_dict(nueva_compra)
            if (nueva_compra.status == PurchaseStatus.PAID):
                print("Compra pagada, enviando notificación...")
                notification = NotificationMessage(
                    email="danielduran3141592@gmail.com",
                    subject=f"Confirmación de compra - {nueva_compra.event_name}",
                    message=f"Gracias por tu compra de {nueva_compra.quantity} entradas para {nueva_compra.event_name}.",
                    purchase_id=nueva_compra.id,
                    event_name=nueva_compra.event_name,
                    quantity=nueva_compra.quantity,
                    total_price=nueva_compra.total_price,
                )
                await publish_message(notification.dict())

            return ResponseSchema(
                status=True,
                status_code=201,
                message="Compra creada exitosamente",
                data=compra_dict
            )
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al crear la compra: {str(e)}"
            )
    
    async def update(self, compra_id: int, data: Dict[str, Any]) -> ResponseSchema:
        """Actualizar una compra existente"""
        # Verificar que la compra existe
        compra = (await self.db_session.scalars(
            select(Compra).where(Compra.id == compra_id)
        )).first()
        
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        
        try:
            # Usar CompraUpdate para validar datos de actualización (campos opcionales)
            validated_data = CompraUpdate(**data)
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Datos inválidos: {str(e)}"
            )
        
        # Actualizar solo los campos que fueron proporcionados
        update_data = {}
        
        # Solo agregar campos que no sean None (fueron proporcionados)
        if validated_data.user_id is not None:
            update_data['user_id'] = validated_data.user_id
        if validated_data.event_id is not None:
            update_data['event_id'] = validated_data.event_id
        if validated_data.event_name is not None:
            update_data['event_name'] = validated_data.event_name
        if validated_data.quantity is not None:
            update_data['quantity'] = validated_data.quantity
        if validated_data.total_price is not None:
            update_data['total_price'] = validated_data.total_price
        if validated_data.status is not None:
            update_data['status'] = validated_data.status
        if validated_data.payment_date is not None:
            update_data['payment_date'] = validated_data.payment_date
        
        if not update_data:
            return ResponseSchema(
                status=True,
                status_code=200,
                message="No hay cambios para actualizar",
                data=to_dict(compra)
            )
        
        try:
            await self.db_session.execute(
                update(Compra).where(Compra.id == compra_id).values(**update_data)
            )
            await self.db_session.commit()
            
            # Obtener la compra actualizada
            compra_actualizada = (await self.db_session.scalars(
                select(Compra).where(Compra.id == compra_id)
            )).first()
            
            compra_dict = to_dict(compra_actualizada)
            return ResponseSchema(
                status=True,
                status_code=200,
                message="Compra actualizada exitosamente",
                data=compra_dict
            )
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al actualizar la compra: {str(e)}"
            )
    
    async def update_status(self, compra_id: int, purchase_update: PurchaseUpdate) -> ResponseSchema:
        """Actualizar solo el estado de una compra"""
        compra = (await self.db_session.scalars(
            select(Compra).where(Compra.id == compra_id)
        )).first()
        
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        
        update_data = {'status': purchase_update.status}
        
        # Si se marca como pagado, establecer la fecha de pago
        if purchase_update.status == PurchaseStatus.PAID and not compra.payment_date:
            update_data['payment_date'] = datetime.now()
        
        try:
            await self.db_session.execute(
                update(Compra).where(Compra.id == compra_id).values(**update_data)
            )
            await self.db_session.commit()
            
            # Obtener la compra actualizada
            compra_actualizada = (await self.db_session.scalars(
                select(Compra).where(Compra.id == compra_id)
            )).first()
            
            compra_dict = to_dict(compra_actualizada)
            return ResponseSchema(
                status=True,
                status_code=200,
                message=f"Estado de la compra actualizado a {purchase_update.status.value}",
                data=compra_dict
            )
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al actualizar el estado de la compra: {str(e)}"
            )
    
    async def delete(self, compra_id: int) -> ResponseSchema:
        """Eliminar una compra"""
        compra = (await self.db_session.scalars(
            select(Compra).where(Compra.id == compra_id)
        )).first()
        
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        
        try:
            await self.db_session.execute(
                delete(Compra).where(Compra.id == compra_id)
            )
            await self.db_session.commit()
            
            return ResponseSchema(
                status=True,
                status_code=200,
                message="Compra eliminada exitosamente",
                data={"deleted_id": compra_id}
            )
        except Exception as e:
            await self.db_session.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error al eliminar la compra: {str(e)}"
            )