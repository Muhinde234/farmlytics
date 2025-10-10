import Image from "next/image";
import image from "../../../public/image/logo.png";

const Logo = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Image src={image} alt="logo picture" width={72} height={72}    />
        
      </div>
    </div>
  );
};

export default Logo;
