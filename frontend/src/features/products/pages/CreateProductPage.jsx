import Navbar
from "../../../components/navbar/Navbar";

import CreateProductForm
from "../components/CreateProductForm";

const CreateProductPage = () => {

  return (

    <div className="min-h-screen bg-gray-100 pb-24">

      <Navbar />

      <div className="max-w-3xl mx-auto px-5 py-10">

        <CreateProductForm />

      </div>

    </div>

  );

};

export default CreateProductPage;