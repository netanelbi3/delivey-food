import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./SingleRestaurant.css";
import { useGetTopThreeByRestaurantIdQuery } from "../slices/reviewApiSlice";

const SingleRestaurant = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const id = queryParams.get("id");
  const name = queryParams.get("name");
  const logo = queryParams.get("logo");
  const address = queryParams.get("address");
  const averageRating = queryParams.get("averageRating");
  const distanceKM = queryParams.get("distanceKM");
  const [hover, setHover] = useState(false);
  const reviewTarget = id;
  const { data: getTopThree } = useGetTopThreeByRestaurantIdQuery(
    reviewTarget,
    {
      skip: !reviewTarget,
    }
  );
  useEffect(() => {}, [getTopThree]);
  // console.log(getTopThree.data.topThree);

  let urlImage;
  if (logo?.startsWith("/uploads")) {
    urlImage = `http://localhost:8000/${logo}`;
  } else {
    urlImage = logo;
  }

  const handleMenuPage = () => {
    navigate(`/MenuList?id=${id}`);
  };

  const handleReviewsPage = () => {
    // const reviewsArrString = JSON.stringify(reviewsArr);
    // const encodedReviewsArrString = encodeURIComponent(reviewsArrString);
    navigate(`/ReviewsPage?id=${id}`);

    // navigate(`/ReviewsPage?id=${id}`);
  };

  const handleBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };
  const handleCardClick = () => {
    // navigate(
    //   `/SingleRestaurant?id=${id}&name=${encodeURIComponent(name)}&logo=${encodeURIComponent(logo)}&address=${encodeURIComponent(address)}&averageRating=${encodeURIComponent(averageRating)}&distanceKM=${encodeURIComponent(distanceKM)}`
    // );
  };

  return (
    <div className="single-restaurant-page">
      {/* Back button */}
      <div className="back-button-container my-3">
        <Button onClick={handleBack} className="btn btn-outline-dark">
          &larr; Back
        </Button>
      </div>

      {/* Full-width image header */}
      <header className="restaurant-header">
        <img src={urlImage} alt={name} className="restaurant-image" />
        <div className="overlay">
          <div>
            <h1 className="restaurant-title">{name}</h1>
          </div>
          <Button
            onClick={handleMenuPage}
            className="btn btn-outline-dark mx-2"
          >
            View Menu
          </Button>
          <Button
            onClick={handleReviewsPage}
            className="btn btn-outline-dark mx-2"
          >
            View Reviews
          </Button>
        </div>
      </header>

      {/* Restaurant details section */}
      <div className="restaurant-details container">
        <div className="row mb-5">
          <div className="col-lg-4 col-md-6">
            <h2>Address</h2>
            <p>{address}</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h2>Distance</h2>
            <p>{distanceKM} KM</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h2>Average Rating</h2>
            <p>{averageRating}</p>
          </div>
        </div>
        <h1>Most popular by rating</h1>
        <div className="d-flex flex-wrap justify-content-start">
          {getTopThree?.data.topThree.map((obj) => {
            return (
              <Card
                key={obj.item._id}
                style={{
                  width: "18rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer", // מציין שהכרטיס ניתן ללחיצה
                  transform: hover ? "scale(1.02)" : "scale(1)", // מגדיל את הכרטיס כאשר העכבר עובר עליו
                  boxShadow: hover
                    ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)", // מוסיף צל כאשר העכבר עובר עליו
                  border: "1px solid #FF5252",
                }}
                onClick={handleCardClick}
                onMouseEnter={() => setHover(true)} // הגדרת מצב hover
                onMouseLeave={() => setHover(false)} // הגדרת מצב hover
              >
                <Card.Img variant="top" src={obj.item.image} />
                <Card.Body>
                  <Card.Title
                    style={{
                      color: "#FF5252",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "15px",
                    }}
                  >
                    {obj.item.name}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    price:
                    {obj.item.price}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>
                      Description:
                    </span>{" "}
                    {obj.item.description}
                  </Card.Text>
                  <Card.Text>
                    {" "}
                    <span style={{ fontWeight: "bold" }}>Rating:</span>{" "}
                    {obj.averageRating}
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <h1>Most popular by sales</h1>
      </div>
    </div>
  );
};

export default SingleRestaurant;
