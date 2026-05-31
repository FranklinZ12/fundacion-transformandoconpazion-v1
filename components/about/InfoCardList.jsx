import InfoCard from "./InfoCard";

export default function InfoCardList({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      {items.map((item, index) => (
        <InfoCard key={index} icon={item.icon} title={item.title} text={item.text} />
      ))}
    </div>
  );
}
