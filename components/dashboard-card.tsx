interface props {
  title: string;
  value: string;
}

export default function DashboardCard({ title, value }: props) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
      <h1>{title}</h1>
      <p className="text-5xl">{value}</p>
    </div>
  );
}
