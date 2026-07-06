# ─── Database import registry ──────────────────────────────────────────────
# Importing all models here so that Alembic can discover them when it runs
# `autogenerate`.  Keep this file in sync with any new model you add.

from app.db.base import Base  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.claim import Claim  # noqa: F401
from app.models.conversation import Conversation, Message  # noqa: F401
from app.models.document import Document  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.policy import Policy  # noqa: F401
from app.models.protection_score import ProtectionScore, RiskProfile  # noqa: F401
from app.models.recommendation import Recommendation  # noqa: F401
from app.models.user import RefreshToken, User  # noqa: F401
