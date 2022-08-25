import { MongoClient, ObjectId } from "mongodb";

const DB = process.env.DB_URL;

async function handler(req, res) {
  const { invoiceId } = req.query;
  const client = await MongoClient.connect(
    `${DB}`,
    { useNewUrlParser: true }
  );
  const db = client.db();

  const collection = db.collection("facturasCO");

  if (req.method === "PUT") {
    await collection.updateOne(
      {
        _id: ObjectId(invoiceId),
      },
      {
        $set: {
          senderAddress: {
            street: req.body.senderStreet,
            city: req.body.senderCity,
            postalCode: req.body.senderPostalCode,
            country: req.body.senderCountry,
          },
          clientName: req.body.clientName,
          clientEmail: req.body.clientEmail,
          clientAddress: {
            street: req.body.clientStreet,
            city: req.body.clientCity,
            postalCode: req.body.clientPostalCode,
            country: req.body.clientCountry,
          },
          createdAt: req.body.createdAt,
          paymentDue: req.body.paymentDue,
          description: req.body.description,
          status: req.body.status,
          items: req.body.items,
          total: req.body.total,
        },
      }
    );

    res.status(200).json({ message: "Invoice updated successfully" });
  }

  client.close();
}

export default handler;
