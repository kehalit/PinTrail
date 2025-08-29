import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-hot-toast";
import { fetchTripsByUserId, deleteTrip } from "../api/trips";
import { getUserPhotos } from "../api/photos";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import TripPopupCard from "../components/TripPopupCard";


const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TripsMap = ({
  setTripForm,
  refreshTrips,
  setRefreshTrips,
  setEditingTrip,
  mapCenter,
  selectedLocation,
  setSelectedLocation,
  locationName,
  mapZoom,
  setLocalClickedLocation,
  showDeleteModal,
  setShowDeleteModal,
}) => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Album overlay state
  const [selectedTripForAlbum, setSelectedTripForAlbum] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadTripsWithPhotos = async () => {
      try {
        const tripsData = await fetchTripsByUserId(user.id);

        const tripsWithPhotos = await Promise.all(
          tripsData.map(async (trip) => {
            const photos = await getUserPhotos(trip.id);
            return { ...trip, photos };
          })
        );

        setTrips(tripsWithPhotos);
      } catch (error) {
        console.error("Error fetching trips or photos:", error);
        toast.error("Failed to fetch trips.");
      }
    };

    loadTripsWithPhotos();
  }, [user, refreshTrips]);

  // Reset photo index whenever a new album opens
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [selectedTripForAlbum]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng, name: "Custom Location" };
        setLocalClickedLocation(newLocation);
        setSelectedLocation(newLocation);
        setTripForm(true);
      },
    });
    return null;
  };

  const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
      toast.success("Trip deleted successfully!");
      setRefreshTrips((prev) => !prev);
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (trip) => {
    setSelectedLocation({ lat: trip.lat, lng: trip.lng, name: trip.title });
    setEditingTrip(trip);
    setTripForm(true);
  };

  return (
    <div>
      <MapContainer
        center={[40, -1]}
        zoom={3}
        className="rounded-2xl shadow-lg border border-gray-100"
        style={{
          height: "80vh",
          width: "95vw",
          margin: "auto",
          filter: theme === "dark" ? "brightness(1)" : "brightness(0.6)",
        }
        }
      >
        <ChangeMapView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <MapClickHandler />

        {trips.map((trip) =>
          trip.lat && trip.lng ? (
            <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={redIcon}>
              <Popup minWidth={300} maxWidth={300}>
                <TripPopupCard
                  trip={trip}
                  onEdit={(trip) => {
                    setSelectedLocation({ lat: trip.lat, lng: trip.lng, name: trip.title });
                    setEditingTrip(trip);
                    setTripForm(true);
                  }}
                  onDelete={(tripId) => {
                    setTripToDelete(tripId);
                    setShowDeleteModal(true);
                  }}
                />
              </Popup>
            </Marker>
          ) : null
        )}


        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <p>{locationName || selectedLocation.name || "Selected Location"}</p>
              <button
                onClick={() => setTripForm(true)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add Trip
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Trip"
          message="Are you sure you want to delete this trip? This action cannot be undone."
          onConfirm={() => handleDeleteTrip(tripToDelete)}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor="bg-red-500"
        />
      )}

      {/* Trip Album Overlay */}
      {selectedTripForAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
          <button
            className="self-end mb-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => setSelectedTripForAlbum(null)}
          >
            Close
          </button>

          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              const reorderedPhotos = Array.from(selectedTripForAlbum.photos);
              const [moved] = reorderedPhotos.splice(result.source.index, 1);
              reorderedPhotos.splice(result.destination.index, 0, moved);
              setSelectedTripForAlbum({ ...selectedTripForAlbum, photos: reorderedPhotos });
              reorderTripPhotos(selectedTripForAlbum.id, reorderedPhotos.map(p => p.id)); // persist order
            }}
          >
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  className="flex gap-2 overflow-x-auto w-full max-w-4xl"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {selectedTripForAlbum.photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          className="relative flex-shrink-0"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || "Trip photo"}
                            className="w-32 h-32 object-cover rounded shadow-lg"
                          />
                          <button
                            className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded"
                            onClick={async () => {
                              await deletePhoto(photo.id);
                              setSelectedTripForAlbum({
                                ...selectedTripForAlbum,
                                photos: selectedTripForAlbum.photos.filter(p => p.id !== photo.id),
                              });
                            }}
                          >
                            Delete
                          </button>
                          <input
                            type="text"
                            value={photo.caption || ""}
                            placeholder="Add caption"
                            className="w-full mt-1 text-sm text-black rounded p-1"
                            onChange={(e) => {
                              const newPhotos = [...selectedTripForAlbum.photos];
                              newPhotos[index].caption = e.target.value;
                              setSelectedTripForAlbum({ ...selectedTripForAlbum, photos: newPhotos });
                            }}
                            onBlur={async (e) => {
                              await updatePhotoCaption(photo.id, e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const uploadedPhoto = await uploadPhoto(selectedTripForAlbum.id, file);
                setSelectedTripForAlbum({
                  ...selectedTripForAlbum,
                  photos: [...selectedTripForAlbum.photos, uploadedPhoto],
                });
              }}
              className="text-white"
            />
            <span className="text-white">Upload a photo</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default TripsMap;
