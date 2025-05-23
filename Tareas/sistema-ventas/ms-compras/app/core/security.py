from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Annotated, List, Dict, Any, Optional
import jwt
from app.core.config import settings
from app.enums.roles_enum import Roles

security = HTTPBearer()

class Auth:
  def __init__(
    self, 
    allowed_roles: Optional[List[Roles]] = None, 
    required_permissions: Optional[List[str]] = None
  ):
    """
    Initialize Auth with optional role and permission requirements.
    
    Args:
      allowed_roles: List of roles that are allowed to access the resource
      required_permissions: List of permissions that are required to access the resource
    """
    self.allowed_roles = allowed_roles or []
    self.required_permissions = required_permissions or []

  def verify_roles(self, user_roles: List[dict]):
    """Verify if user has any of the allowed roles."""
    if not self.allowed_roles:
      return
    
    if not user_roles:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="User has no roles assigned"
      )
    
    allowed_role_ids = [role.value[0] for role in self.allowed_roles]
    allowed = any(role['id'] in allowed_role_ids for role in user_roles)

    if not allowed:
      raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="forbidden data"
      )

  # def verify_permissions(self, user_permissions: List[str]):
  #   """
  #   Verify if user has all required permissions.
  #   """
  #   if not self.required_permissions:
  #     return
    
  #   if not user_permissions:
  #     raise HTTPException(
  #       status_code=status.HTTP_403_FORBIDDEN,
  #       detail="User has no permissions assigned"
  #     )
    
  #   has_all_permissions = all(
  #     permission in user_permissions 
  #     for permission in self.required_permissions
  #   )
    
  #   if not has_all_permissions:
  #     raise HTTPException(
  #       status_code=status.HTTP_403_FORBIDDEN,
  #       detail=f"Missing required permissions. Required: {', '.join(self.required_permissions)}"
  #     )

  def __call__(
    self,
    request: Request,
    token: Annotated[str, Depends(security)]
  ) -> Dict[str, Any]:
    # Decode JWT token
    try:
      print("token:",token.credentials)
      print("secret:",settings.JWT_SECRET_KEY)
      print("algorithm:",settings.JWT_ALGORITHM)
      payload = jwt.decode(
        jwt=token.credentials,
        key=settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM]
      )
    except jwt.InvalidTokenError:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token"
      )

    # Extract user information
    user_roles = payload.get("roles", [])
    # user_permissions = payload.get("permissions", [])

    # Verify both roles and permissions
    self.verify_roles(user_roles)
    # self.verify_permissions(user_permissions)

    # Global user
    request.state.user = {
      "user_id": payload.get("sub"),
    }
    print("request.state.user:",request.state.user)
    return {
      "user_id": payload.get("sub"),
      "roles": user_roles,
      # "permissions": user_permissions
    }