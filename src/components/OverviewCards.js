// const img1 = "/images/user1.png";

const OverviewCards = ({ ovimg, title, price, discount }) => {
  return (
    <div className="OverviewCards">
      <img src={ovimg} alt="User" />
      <p>{title || "Title"}</p>
      <h2>{price || "22.2"}</h2>
      <h5>
        {discount || "10"} <span>Today</span>
      </h5>
    </div>
  );
};

export default OverviewCards;
