import taskModel from "../model/task.model.js";

export const createTask = async (req, res) => {
  try {
    const createTask = await taskModel.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
    });

    res.status(201).json({
      success: true,
      message: "task created successfully",
      task: createTask,
    });
  } catch (error) {
    console.error("error from create task", error);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const getTask = await taskModel.find();

    res.status(200).json({
      success: true,
      message: "Successfully get all tasks",
      task: getTask,
    });
  } catch (error) {
    console.error("error from get all task", error);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const updateTask = async (req, res) => {
    try {
      const updateTask = await taskModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true,runValidators:true})

        if (!updateTask) {
            return res.status(404).json({
                success: false,
                message:"task not found"
          })
        }
        
        res.status(200).json({
            success:true,
            message: "Successfully update task",
            task:updateTask
        })
  } catch (error) {
    console.error("error from update task", error);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getSingleTask = async (req,res) => {
    try {
        const singleTask = await taskModel.findById(req.params.id)

        if (!singleTask) {
            return res.status(404).json({
                success: false,
                message:"Task not found"
            })
        }

        res.status(200).json({
            successL: true,
            message: "task successfully get",
            task:singleTask
        })
        
    } catch (error) {
          console.error("error from single task fetch", error) 
        
        res.status(500).json({
            success: false,
            message:"internal server error"
        })
    }
}