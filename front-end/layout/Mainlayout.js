import Leftbar from "@/components/Leftbar";
import Message from "@/components/Message";

const Mainlayout = (props) => {
  const { middleComponent: MiddleComponent } = props;

  return (
    <>
        <div className="flex flex-row justify-between">
            <Leftbar />
            <MiddleComponent {...props} />
        </div>
    </>
  );
};

export default Mainlayout;
