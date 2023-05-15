import axios from 'axios';

async function getGym(placeId: string) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/gyms/getById`,
      {
        placeId,
      }
    );
    return res.data.gym;
  } catch (error) {
    console.log(error);
  }
}

export default async function GymPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log(params);

  const gym = await getGym(params.slug);
  console.log(gym);

  return (
    <div>
      <h1>{gym?.name}</h1>
    </div>
  );
}
