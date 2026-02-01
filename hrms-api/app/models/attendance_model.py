from sqlalchemy import Column, String, Date, DateTime, func, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database.connection import Base
import enum

class AttendanceStatus(enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(String(50), ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    status = Column(Enum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Unique constraint for employee_id + date
    __table_args__ = (
        UniqueConstraint('employee_id', 'date', name='uix_employee_date'),
    )

    # Relationship to Employee
    employee = relationship("Employee", backref="attendance_records")