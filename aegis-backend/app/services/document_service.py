"""Document service — file upload stored in local filesystem (swap for S3 in prod)."""
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"Identity", "Vehicle", "Medical", "Policy", "Bill"}


async def list_documents(user_id: uuid.UUID, db: AsyncSession) -> list[Document]:
    result = await db.execute(select(Document).where(Document.user_id == user_id))
    return list(result.scalars().all())


async def upload_document(
    user_id: uuid.UUID,
    doc_type: str,
    file: UploadFile,
    db: AsyncSession,
) -> Document:
    if doc_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"doc_type must be one of {sorted(ALLOWED_TYPES)}",
        )

    ext = Path(file.filename or "file").suffix
    storage_key = f"{user_id}/{uuid.uuid4()}{ext}"
    dest = UPLOAD_DIR / storage_key
    dest.parent.mkdir(parents=True, exist_ok=True)
    content = await file.read()
    dest.write_bytes(content)

    doc = Document(
        user_id=user_id,
        filename=file.filename or "unknown",
        doc_type=doc_type,
        storage_key=str(storage_key),
        extracted_fields=None,
        status="Uploaded",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


async def get_document(doc_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Document:
    result = await db.execute(
        select(Document).where(Document.id == doc_id, Document.user_id == user_id)
    )
    doc = result.scalar_one_or_none()
    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


async def delete_document(doc_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> None:
    doc = await get_document(doc_id, user_id, db)
    path = UPLOAD_DIR / doc.storage_key
    if path.exists():
        os.remove(path)
    await db.delete(doc)
    await db.commit()
