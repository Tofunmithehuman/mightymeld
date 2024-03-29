export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-14 w-14 bg-purple-400 text-center rounded-xl"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-14 w-14 bg-purple-500 text-center rounded-xl">
          <Content
            style={{
              display: "inline-block",
              width: "80%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-14 w-14 text-blue-300">
          <Content
            style={{
              display: "inline-block",
              width: "80%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return (
    <div onClick={flip} className={className}>
      
    </div>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
