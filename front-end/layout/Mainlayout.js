import Leftbar from "@/components/Leftbar";

const Mainlayout = ({ middleComponent }) => {
  return (
    <>
      <div className="flex flex-row justify-between">
        <Leftbar />
        {middleComponent}
      </div>
    </>
  );
};

export default Mainlayout;
