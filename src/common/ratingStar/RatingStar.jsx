const RatingStar = ({ starValue }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (starValue >= i) {
      stars.push(<i key={i} className="fa-solid fa-star text-orange-400" />);
    } else if (starValue >= i - 0.5) {
      stars.push(<i key={i} className="fa-regular fa-star-half-stroke text-orange-400" />);
    } else {
      stars.push(<i key={i} className="fa-regular fa-star text-orange-400" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
    </div>
  );
};

export default RatingStar;
