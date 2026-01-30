#!/usr/bin/env python
"""Test event components"""

from app.models import Event, EventType
from app.services.event import EventService
from app.controllers.event import event_router
from app.schemas.event import CreateEventRequest, EventResponse

print('✓ Event model loaded successfully')
print('✓ EventType enum loaded successfully')
print('✓ EventService loaded successfully')
print('✓ Event controller loaded successfully')
print('✓ Event schemas loaded successfully')
print('✅ All event components loaded successfully!')
