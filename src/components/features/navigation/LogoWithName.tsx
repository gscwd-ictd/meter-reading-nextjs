import gscwd_logo from "../../../../public/images/main_logo_transparent2_wBG.png";

export const LogoWithName = () => {
  return (
    <div className="flex">
      <div className="flex w-full justify-center text-center">
        <img
          src={gscwd_logo.src}
          width={120}
          height={120}
          alt="gscwd-logo"
          fetchPriority="low"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="font-semibold">General Santos City Water District</div>
    </div>
  );
};
