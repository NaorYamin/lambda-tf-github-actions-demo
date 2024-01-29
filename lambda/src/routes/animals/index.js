import express from "express";
import * as controllers from "../../controllers/animals/index.js";
import { checkValidation } from "../../middlewares/index.js";
import { createAnimalValidator } from "../../validators/index.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/",
  upload.array("images", 4),
  ...checkValidation(createAnimalValidator),
  controllers.createAnimal
);

router.get("/:animalId", controllers.getAnimalById);
router.patch("/:animalId/toggleActiveStatus", controllers.toggleActiveStatus);

export default router;
