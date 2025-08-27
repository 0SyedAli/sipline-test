const OverviewCards = ({ ovimg, title, price, discount }) => {
  return (
    <div className="OverviewCards">
      <img src={ovimg} alt="User" />
      <p>{title || "Title"}</p>
      <h2>{price ?? "$0.00"}</h2>
      {discount && <h5>
        {discount ?? "-"}
      </h5>
      }
    </div>
  );
};

export default OverviewCards;
