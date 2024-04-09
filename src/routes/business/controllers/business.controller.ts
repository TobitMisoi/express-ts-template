import express from "express";
import pool from "../../../common/services/db.service";
import { v4 } from "uuid";
import { BankDetailsDto, CreateBusinessDto } from "../dto/create.business.dto";

class BusinessController {
  async listBusinesses(req: express.Request, res: express.Response) {
    pool.query("SELECT * FROM business", (error: any, results: any) => {
      if (error) {
        console.error("Error listing businesses:", error);
        res.status(500).send("Error listing businesses");
        return;
      }
      const businesses = results.map((business: any) => {
        const { ...safeBusiness } = business;
        return safeBusiness;
      });
      res.status(200).send(businesses);
    });
  }

  // create
  async createBusiness(req: express.Request, res: express.Response) {
    const pid = v4();

    const {
      name,
      contact,
      email,
      website,
      registration_type,
      description,
      address,
    }: CreateBusinessDto = req.body;
    const queryParams = {
      public_id: pid,
      name,
      contact: JSON.stringify(contact),
      email,
      website,
      registration_type,
      description,
      address: JSON.stringify(address),
    };

    const insertQuery = "INSERT INTO business SET ?";
    pool.query(insertQuery, queryParams, (error: any, results: any) => {
      if (error) {
        console.error("Error creating business:", error);
        res.status(500).send("Error creating business");
        return;
      }
      res.status(200).send({ message: "Business created" });
    });
  }

  // update
  async updateBusiness(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const {
      name,
      contact,
      email,
      website,
      registration_type,
      description,
      address,
    }: CreateBusinessDto = req.body;

    const updateQuery = `UPDATE business SET
      name = COALESCE(?, name),
      contact = COALESCE(?, contact),
      email = COALESCE(?, email),
      website = COALESCE(?, website),
      registration_type = COALESCE(?, registration_type),
      description = COALESCE(?, description),
      address = COALESCE(?, address)
      WHERE public_id = ?`;

    const updateParams = [
      name,
      JSON.stringify(contact),
      email,
      website,
      registration_type,
      description,
      JSON.stringify(address),
      id,
    ];

    pool.query(updateQuery, updateParams, (error: any, results: any) => {
      if (error) {
        console.error("Error updating business:", error);
        res.status(500).send("Error updating business");
        return;
      }
      res.status(200).send({ message: "Business updated" });
    });
  }

  // add bank details

  // add bank details
  async addBankDetails(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const { bank_name, account_number, account_name, swift_code, branch_code }: BankDetailsDto = req.body;
    const pid = v4();



       const insertQuery = `INSERT INTO business_banking_details (business_id, public_id, bank_name, account_name, account_number, swift_code, branch_code)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
       const insertParams = [
         id,
         pid,
         bank_name,
         account_name,
         account_number,
         swift_code,
         branch_code,
       ];

    pool.query(insertQuery, insertParams, (error: any, results: any) => {
      if (error) {
        console.error("Error updating business:", error);
        res.status(500).send("Error updating business");
        return;
      }
      res.status(200).send({ message: "Business bank details updated" });
    });
  }

  // get bank details

  // get bank details
  async getBankDetails(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const query =
      "SELECT * FROM business_banking_details WHERE business_id = ?";
    const params = [id];

    pool.query(query, params, (error: any, results: any) => {
      if (error) {
        console.error("Error getting bank details:", error);
        res.status(500).send("Error getting bank details");
        return;
      }

      res
        .status(200)
        .send(
          results?.map(
            ({ business_id, ...safeBankDetails }: any) => safeBankDetails
          )
        );
    });
  }

}

export default new BusinessController();
