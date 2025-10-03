import Image from "next/image";
import image from "../../../public/image/logo.png";

const Logo = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Image src={image} alt="logo picture" width={52} height={52} className="w-22 h-22 rounded-full border border-white" />
        
      </div>
    </div>
  );
};

export default Logo;
