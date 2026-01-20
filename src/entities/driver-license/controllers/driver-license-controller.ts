import type {Request, Response} from 'express';
import {Router} from 'express';
import {asyncHandler} from "@/shared/async-handler";
import * as driverLicenseServices from "@/entities/driver-license/services/driver-license-service";
import * as types from "@/entities/driver-license/types";

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const driverLicense: Array<types.DriverLicense> = await driverLicenseServices.getAllDriverLicenses();
    res.json(driverLicense);
})
);

router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const newDriverLicense: types.DriverLicense = await driverLicenseServices.createDriverLicense(req.body);
    res.status(201).json(newDriverLicense);
})
);

router.put('/:id', async (req: Request, res: Response) =>{
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({message: "Id is required"});
    }
    const updateDriverLicense: types.DriverLicense = await driverLicenseServices.updateDriverLicense(id, req.body);
    res.status(200).json(updateDriverLicense);
});

router.get("/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({message: "Id is required"});
    }

    try {
        const driverLicense = await driverLicenseServices.getDriverLicenseById(id);
        if (!driverLicense) {
            return res.status(400).json({message: "Driver License not found"});
        }
        res.status(200).json(driverLicense);
    } catch (error) {
        console.error("Error fetching driver license", error);
        res.status(500).json({message: "Internal server error"})
    }
})

export default router;