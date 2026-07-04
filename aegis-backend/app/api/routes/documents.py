import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.document import DocumentOut
from app.services import document_service

router = APIRouter()


@router.get("/", response_model=list[DocumentOut], summary="List uploaded documents")
async def list_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await document_service.list_documents(current_user.id, db)


@router.post(
    "/",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document",
)
async def upload_document(
    doc_type: str = Form(..., description="Identity | Vehicle | Medical | Policy | Bill"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await document_service.upload_document(current_user.id, doc_type, file, db)


@router.get("/{doc_id}", response_model=DocumentOut, summary="Get document metadata")
async def get_document(
    doc_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await document_service.get_document(doc_id, current_user.id, db)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete document")
async def delete_document(
    doc_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await document_service.delete_document(doc_id, current_user.id, db)
