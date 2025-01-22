from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio
from services.scheduling_service import SchedulingService
from services.analytics_service import AnalyticsService

class SchedulerTasks:
    def __init__(self, db: Session):
        self.db = db
        self.scheduling_service = SchedulingService(db)
        self.analytics_service = AnalyticsService(db)

    async def process_scheduled_posts(self):
        """Process posts that are due for publishing"""
        while True:
            try:
                await self.scheduling_service.process_due_posts()
            except Exception as e:
                print(f"Error processing scheduled posts: {str(e)}")
            
            await asyncio.sleep(60)  # Check every minute

    async def update_post_analytics(self):
        """Update analytics for recent posts"""
        while True:
            try:
                await self.analytics_service.update_recent_posts()
            except Exception as e:
                print(f"Error updating analytics: {str(e)}")
            
            await asyncio.sleep(300)  # Update every 5 minutes

# /app/backend/tasks/autoresponder.py
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
import asyncio
from services.autoresponder_service import AutoresponderService

class AutoresponderTasks:
    def __init__(self, db: Session):
        self.db = db
        self.autoresponder_service = AutoresponderService(db)

    async def process_responses(self):
        """Process autoresponder rules"""
        while True:
            try:
                await self.autoresponder_service.process_pending_responses()
            except Exception as e:
                print(f"Error processing autoresponders: {str(e)}")
            
            await asyncio.sleep(30)  # Check every 30 seconds

# /app/backend/tasks/task_manager.py
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
import asyncio
from .scheduler import SchedulerTasks
from .autoresponder import AutoresponderTasks

class TaskManager:
    def __init__(self, db: Session):
        self.scheduler_tasks = SchedulerTasks(db)
        self.autoresponder_tasks = AutoresponderTasks(db)
        self.tasks = []

    async def start_all_tasks(self):
        """Start all background tasks"""
        self.tasks = [
            asyncio.create_task(self.scheduler_tasks.process_scheduled_posts()),
            asyncio.create_task(self.scheduler_tasks.update_post_analytics()),
            asyncio.create_task(self.autoresponder_tasks.process_responses())
        ]
        
        await asyncio.gather(*self.tasks)

    async def stop_all_tasks(self):
        """Stop all background tasks"""
        for task in self.tasks:
            task.cancel()
        
        await asyncio.gather(*self.tasks, return_exceptions=True)
        self.tasks = []