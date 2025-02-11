const Rating = {
  render: (props) => {
    if (!props.value) {
      return "<div></div>";
    }

    // I would round the total stars down and append star html that many times and then evaluate the remainder
    const starOne =
      props.value >= 1
        ? "fa fa-star"
        : props.value >= 0.5
          ? "fa fa-star-half-stroke"
          : "fa-regular fa-star";

    const starTwo =
      props.value >= 2
        ? "fa fa-star"
        : props.value >= 1.5
          ? "fa fa-star-half-stroke"
          : "fa-regular fa-star";

    const starThree =
      props.value >= 3
        ? "fa fa-star"
        : props.value >= 2.5
          ? "fa fa-star-half-stroke"
          : "fa-regular fa-star";

    const starFour =
      props.value >= 4
        ? "fa fa-star"
        : props.value >= 3.5
          ? "fa fa-star-half-stroke"
          : "fa-regular fa-star";

    const starFive =
      props.value >= 5
        ? "fa fa-star"
        : props.value >= 4.5
          ? "fa fa-star-half-stroke"
          : "fa-regular fa-star";

    return `
      <div class="rating">
        <span>
          <i class = "${starOne}">
          </i>
        </span>
        <span>
          <i class = "${starTwo}">
          </i>
        </span>
        <span>
          <i class = "${starThree}">
          </i>
        </span>
        <span>
          <i class = "${starFour}">
          </i>
        </span>
        <span>
          <i class = "${starFive}">
          </i>
        </span>
        <span>
          ${props.text || ""}
        </span>
      </div>
      `;
  },
};

export default Rating;
