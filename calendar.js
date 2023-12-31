var sample;
var sample2022;
var sample2023;
var dateValues;
async function fetchData() {
  try {
    const response2022 = await fetch("./moodJSON_2022.json");
    const data2022 = await response2022.json();
    const response2023 = await fetch("./moodJSON_2023.json");
    const data2023 = await response2023.json();

    // Store the data in a variable
    sample2022 = data2022;
    sample2023 = data2023;

    sample = sample2022.concat(sample2023);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function draw() {
  const svg = d3.select("#svg");
  const { width, height } = document
    .getElementById("svg")
    .getBoundingClientRect();

  const years = d3
    .nest()
    .key((d) => d.date.getUTCFullYear())
    .entries(dateValues);
  //   .reverse();

  const values = dateValues.map((c) => c.value);
  // const maxValue = d3.max(values);
  // const minValue = d3.min(values);
  const maxValue = 5;
  const minValue = 0;

  const cellSize = 15;
  const yearHeight = cellSize * 7;

  const group = svg.append("g");
  // group.attr("padding", 20);
  // Now let’s append a group for each year we would like to display. These groups are the “containers” of the days.
  const year = group
    .selectAll("g")
    .data(years)
    .join("g")
    .attr("padding", 30)
    .attr(
      "transform",
      (d, i) => `translate(100, ${yearHeight * i + cellSize * 1.5})`
    );

  //   caption displaying the year
  year
    .append("text")
    .attr("x", -5)
    .attr("y", -40)
    // .attr("x", -2)
    // .attr("y", -10)
    .attr("text-anchor", "end")
    .attr("font-size", 16)
    .attr("font-weight", 550)
    .attr("transform", "rotate(270)")
    .text((d) => d.key);

  const formatDay = (d) =>
    ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"][d.getUTCDay()];
  const countDay = (d) => d.getUTCDay();
  const timeWeek = d3.utcSunday;
  const formatDate = d3.utcFormat("%x");
  const colorFn = d3
    .scaleSequential(d3.interpolateMagma)
    .domain([Math.floor(minValue), Math.ceil(maxValue)]);
  const format = d3.format("+.2%");

  // I want to show the names of the days on the left side of the calendar.
  year
    .append("g")
    .attr("text-anchor", "end")
    .selectAll("text")
    .data(d3.range(7).map((i) => new Date(1995, 0, i)))
    .join("text")
    .attr("x", -5)
    .attr("y", (d) => (countDay(d) + 0.5) * cellSize)
    .attr("dy", "0.31em")
    .attr("font-size", 12)
    .text(formatDay);

  //   Now, here comes the essence of the calendar. One rectangle stands for each day that represents a value.
  year
    .append("g")
    .selectAll("rect")
    .data((d) => d.values)
    .join("rect")
    .attr("width", cellSize - 1.5)
    .attr("height", cellSize - 1.5)
    .attr(
      "x",
      (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
    )
    .attr("y", (d) => countDay(d.date) * cellSize + 0.5)
    .attr("fill", (d) => colorFn(d.value))
    .append("title")
    .text((d) => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

  //   First, I append a new legend group and move it to the end of the years.
  const legend = group
    .append("g")
    .attr(
      "transform",
      `translate(100, ${years.length * yearHeight + cellSize * 4})`
    );

  //   Then I divide the range between the min and max value into equal parts. Also, I generate a color for each using the defined colorFn utility function.
  const categoriesCount = 5;
  const categories = [...Array(categoriesCount)].map((_, i) => {
    const upperBound = (maxValue / categoriesCount) * (i + 1);
    const lowerBound = (maxValue / categoriesCount) * i;
    // const upperBound = 5;
    // const lowerBound = 0;

    return {
      upperBound,
      lowerBound,
      color: d3.interpolateMagma(upperBound / maxValue),
      selected: true,
    };
  });

  const legendWidth = 60;

  // I create a toggle function that handles whenever the user clicks on one of the range values.
  function toggle(legend) {
    const { lowerBound, upperBound, selected } = legend;

    legend.selected = !selected;

    const highlightedDates = years.map((y) => ({
      key: y.key,
      values: y.values.filter(
        (v) => v.value > lowerBound && v.value <= upperBound
      ),
    }));

    year
      .data(highlightedDates)
      .selectAll("rect")
      .data(
        (d) => d.values,
        (d) => d.date
      )
      .transition()
      .duration(500)
      .attr("fill", (d) => (legend.selected ? colorFn(d.value) : "white"));
  }

  // Next step is to draw a rectangle for each category that we just created.
  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("fill", (d) => d.color)
    .attr("x", (d, i) => legendWidth * i)
    .attr("width", legendWidth)
    .attr("height", 15)
    .on("click", toggle);

  const mood = ["Stressed", "Sad", "Tired", "Ok", "Amazing"];
  legend
    .selectAll("text")
    .data(mood)
    .join("text")
    .attr("transform", "rotate(90)")
    .attr("y", (d, i) => -legendWidth * i)
    .attr("dy", -30)
    .attr("x", 18)
    .attr("text-anchor", "start")
    .attr("font-size", 11)
    .attr("radius", 3)
    .text((d) => d);
  // .text(d => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

  legend
    .append("text")
    .attr("dy", -5)
    .attr("font-size", 14)
    .attr("text-decoration", "underline")
    .text("Click on category to select/deselect days");
}

(async () => {
  await fetchData();
  // Log or use the dataArray as needed
  // console.log(sample2022);
  console.log(sample);

  sample.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  sample.forEach((element) => {
    if (element["Mood"] == "amazing") {
      element["Mood"] = 5;
    } else if (element["Mood"] == "ok") {
      element["Mood"] = 4;
    } else if (element["Mood"] == "tired") {
      element["Mood"] = 3;
    } else if (element["Mood"] == "sad") {
      element["Mood"] = 2;
    } else if (element["Mood"] == "stressed") {
      element["Mood"] = 1;
    }
  });

  dateValues = sample.map((dv) => ({
    date: d3.timeDay(new Date(dv.Date)),
    value: Number(dv.Mood),
  }));

  draw();
})();
