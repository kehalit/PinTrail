
from abc import ABC, abstractmethod

class DataManagerInterface(ABC):

    @abstractmethod
    def get_all_users(self):
        pass

    @abstractmethod
    def get_user_by_id(self, user_id):
        pass

    @abstractmethod
    def get_trips(self):
        pass

    @abstractmethod
    def create_trip(self, trip_data):
        pass

    @abstractmethod
    def get_trips_by_user(self, user_id):
        pass

    @abstractmethod
    def add_activity_to_trip(self, trip_id, activity_data):
        pass

    @abstractmethod
    def add_photo_to_activity(self, activity_id, photo_data):
        pass
