import ScrollMenu from "react-horizontal-scrolling-menu";

const HorizontalList = () => {
  const items = Array.from({ length: 10 }).map((_, index) => ({
    id: index,
    title: `Video Title ${index + 1}`,
  }));

  return (
    <ScrollMenu
      data={items.map((item) => (
        <div key={item.id} style={{ width: "200px", margin: "0 8px" }}>
          <img
            src="https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center"
            alt="Thumbnail"
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <h4>{item.title}</h4>
        </div>
      ))}
      arrowLeft={<div>{"<"}</div>}
      arrowRight={<div>{">"}</div>}
    />
  );
};

export default HorizontalList;
