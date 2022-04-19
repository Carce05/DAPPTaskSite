const TasksContract = artifacts.require("TasksContract")

contract("TasksContractTest", () => {

   before(async () => {

      this.vTasksContract = await TasksContract.deployed()

   })

   it('migrate deployed successfully', async () => {

      const address = this.vTasksContract.address


      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");


   })

   it('get Tasks List', async () => {
      const vTasksCounter = await this.vTasksContract.tasksCounter()
      const task = await this.vTasksContract.tasks(vTasksCounter)

      assert.equal(task.id.toNumber(), vTasksCounter);
      assert.equal(task.title, "mi primer tarea");
      assert.equal(task.description, "ejemplo");
      assert.equal(task.done, false);
      assert.equal(vTasksCounter, 1);
   })


   it("task created succesfully", async () => {

      const result = await this.vTasksContract.createTask("some task", "description two")
      const vTaskEvent = result.logs[0].args;
      const vTasksCounter = await this.vTasksContract.tasksCounter()


      assert.equal(vTasksCounter, 2);
      assert.equal(vTaskEvent.id.toNumber(), 2);
      assert.equal(vTaskEvent.title, "some task");
      assert.equal(vTaskEvent.description, "description two");
      assert.equal(vTaskEvent.done, false);

   });

   it("task toggle done", async () => {

      const result = await this.vTasksContract.toggleDone(1);
      const vTaskEvent = result.logs[0].args;
      const task = await this.vTasksContract.tasks(1);


      assert.equal(task.done, true);
      assert.equal(vTaskEvent.done, true);
      assert.equal(vTaskEvent.id, 1);
      

   })




})