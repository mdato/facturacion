import React, { useRef } from "react";
import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";
import { toast } from "react-toastify";

const DB = process.env.DB_URL;

const InvoiceDetails = (props) => {
  const router = useRouter();
  const { data } = props;
  const modalRef = useRef(null);

  const goBack = () => router.push("/");

  const updateStatus = async (invoiceId) => {
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "PUT",
    });
    const data = await res.json();
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const modalToggle = () => modalRef.current.classList.toggle("showModal");

  return (
    <div className="main__container">
      <div className="back__btn">
        <h6 onClick={goBack}> ⬅</h6>
      </div>

      <div className="invoice__details-header">
        <div className="details__status">
          <p className="elStatus">Status</p>

          <button
            className={`${data.status === "paid"
              ? "paid__status"
              : data.status === "pending"
                ? "pending__status"
                : "draft__status"
              }`}
          >
            {data.status}
          </button>
        </div>

        <div className="details__btns">
          <button
            className="edit__btn"
            onClick={() => router.push(`/edit/${data.id}`)}
          >
            Edit
          </button>

          <div className="delete__modal" ref={modalRef}>
            <div className="modal">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete invoice #
                {data.id.substr(0, 6).toUpperCase()}? This action cannon be
                undone.
              </p>

              <div className="details__btns modal__btns">
                <button className="edit__btn" onClick={modalToggle}>
                  Cancel
                </button>

                <button
                  className="delete__btn"
                  onClick={() => deleteInvoice(data.id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          <button className="delete__btn" onClick={modalToggle}>
            Delete
          </button>

          <button
            onClick={() => updateStatus(data.id)}
            className={`${data.status === "paid" || data.status === "draft" ? "disable" : ""
              }  mark__as-btn`}
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="invoice__details">
        <div className="details__box">
          <div>
            <p>Invoice Nº </p>
            <h4>{data.id.substr(0, 5).toUpperCase()}</h4>
            <p>{data.description}</p>
          </div>
          <div>
            <p>{data.senderAddress.street}</p>
            <p>{data.senderAddress.city}</p>
            <p>{data.senderAddress.postalCode}</p>
            <p>{data.senderAddress.country}</p>
          </div>
        </div>

        <div className="details__box">
          <div>
            <div className="invoice__created-date">
              <p>Invoice Date</p>
              <h4>{data.createdAt}</h4>
            </div>
            <div>
              <p className="invoice__payment">Payment Due</p>
              <h4>{data.paymentDue}</h4>
            </div>
          </div>

          <div className="invoice__client-address">
            <p>Bill to</p>
            <h4>{data.clientName}</h4>
            <div>
              <p>{data.clientAddress.street}</p>
              <p>{data.clientAddress.city}</p>
              <p>{data.clientAddress.postalCode}</p>
              <p>{data.clientAddress.country}</p>
            </div>
          </div>

          <div className="enviamos">
            <p>Send to</p>
            <h4>{data.clientEmail}</h4>
          </div>
        </div>

        <div className="invoice__item-box">
          <ul className="list">
            <li className="list__item">
              <p className="item__name-box">Item Name</p>
              <p className="list__item-box">Qty</p>
              <p className="list__item-box">Price</p>
              <p className="list__item-box">Total</p>
            </li>

            {data.items?.map((item, index) => (
              <li className="list__item" key={index}>
                <div className="item__name-box">
                  <h5>{item.name}</h5>
                </div>

                <div className="list__item-box">
                  <p>{item.quantity}</p>
                </div>
                <div className="list__item-box">
                  <p>${item.price}</p>
                </div>
                <div className="list__item-box">
                  <h5>${item.total}</h5>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="invoice__total">
          <h5>Invoice Total</h5>
          <h2>${data.total}</h2>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `${DB}`,
    { useNewUrlParser: true }
  );

  const db = client.db();

  const collection = db.collection("facturasCO");

  const invoices = await collection.find({}, { _id: 1 }).toArray();

  return {
    fallback: "blocking",
    paths: invoices.map((invoice) => ({
      params: {
        invoiceId: invoice._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const { invoiceId } = context.params;

  const client = await MongoClient.connect(
    `${DB}`,
    { useNewUrlParser: true }
  );

  const db = client.db();

  const collection = db.collection("facturasCO");

  const invoice = await collection.findOne({ _id: ObjectId(invoiceId) });

  return {
    props: {
      data: {
        id: invoice._id.toString(),
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        description: invoice.description,
        createdAt: invoice.createdAt,
        paymentDue: invoice.paymentDue,
        items: invoice.items,
        total: invoice.total,
        status: invoice.status,
      },
    },
    revalidate: 1,
  };
}