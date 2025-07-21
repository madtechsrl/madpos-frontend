// NewProductPage.tsx (Vite + Bootstrap + FontAwesome version)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUpload, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { mockCategories } from "../../lib/data";
import type { Categories } from "../../contexts/product-context";


export default function NewProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    promotionalPrice: "",
    category: "",
    labelName: "",
    description: "",
    code: "",
    cost: "",
    unit: "Unidad",
    currentStock: "",
    minStock: "",
    trackStock: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", formData);
    navigate("/products");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
   
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} tabIndex={-1}>
      <div className="modal-dialog modal-x1 modal-dialog-scrollble">
        <div className="modal-content">
          <div className="modal-header border=0 pb-0">
            <div className="d-flex align-items-center">
            <button type="button" className="btn btn-link text-dark p-0 me-2" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            </div>
          </div>
          </div>
        
      </div>
    </div>
  );
}
