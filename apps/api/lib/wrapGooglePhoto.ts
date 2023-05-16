export default function wrapGooglePhotoRefernce(reference: string) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
}
