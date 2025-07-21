
from abc import ABC, abstractmethod

class DataManagerInterface(ABC):


    @abstractmethod
    def get_trips(self):
        pass

    @abstractmethod
    def get_trip_by_id(self, trip_id):
        pass

    @abstractmethod
    def add_trip(self, trip_data):
        pass

    @abstractmethod
    def update_trip(self, trip_id, data):
        pass

    @abstractmethod
    def delete_trip(self, trip_id):
        pass

    @abstractmethod
    def get_trips_by_user(self, user_id):
        pass

    @abstractmethod
    def add_user(self, username, email, password):
        pass

    @abstractmethod
    def get_all_users(self):
        pass

    @abstractmethod
    def get_user_by_id(self, user_id):
        pass

    @abstractmethod
    def update_user(self, user_id, updated_data):
        pass

    @abstractmethod
    def delete_user(self, user_id):
        pass

    @abstractmethod
    def add_activity(self, data):
        pass

    @abstractmethod
    def get_activities(self):
        pass

    @abstractmethod
    def get_activity_by_id(self, activity_id):
        pass

    @abstractmethod
    def update_activity(self, activity_id, updates):
        pass

    @abstractmethod
    def delete_activity(self, activity_id):
        pass

    @abstractmethod
    def is_token_blacklisted(self, jti):
        pass

    @abstractmethod
    def blacklist_token(self, jti):
        pass