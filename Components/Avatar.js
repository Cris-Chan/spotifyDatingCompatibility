import Image from "next/image";

const imageSize = 14;

export default function Avatar({ name, url }) {
  return (
    <div className="w-32 flex flex-col gap-1 items-center justify-center">
      <img className="object-cover w-20 h-20 rounded-full" src={url} />
      <h1 className="font-puffy w-32 truncate">{name}</h1>
    </div>
  );
}
