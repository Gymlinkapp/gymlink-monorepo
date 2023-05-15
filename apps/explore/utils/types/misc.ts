export type SelectedGymAndLatLong = {
  gym: {
    name: string;
    theme: string;
    latitude: number;
    longitude: number;
    adddress: string;
    photos: { photo_reference: string }[];
    placeId: string;
  };
  longitude: number;
  latitude: number;
};
