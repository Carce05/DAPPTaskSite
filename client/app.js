App = {
    contracts: {},

    init: async () => {
        console.log('Loaded')
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.rendertasks()
    },

    loadEthereum: async () => {

        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })

        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider)
        } else {
            console.log('No Ethereum browser installed. Try installing Metamask')
        }
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log(accounts)
        App.account = accounts[0]
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const TasksContractJSON = await res.json()
        App.contracts.tasksContract = TruffleContract(TasksContractJSON)


        App.contracts.tasksContract.setProvider(App.web3Provider);

        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    render: () => {
        document.getElementById('account').innerText = App.account
    },

    rendertasks: async () => {
        const taskCounter = await App.tasksContract.tasksCounter()
        const taskCounterNumber = taskCounter.toNumber()
        console.log(taskCounterNumber)

        let html = ''

        for (let i = 1; i <= taskCounterNumber; i++) {

            const task = await App.tasksContract.tasks(i)

            const taskId = task[0].toNumber();
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4]

            let taskElement = `
        <div class="card bg-dark  mb-2" style="border-radius: 0% 6% / 0% 6%;">

            <div class="card-header d-flex justify-content-between align-items-center">

                <span>${taskTitle}</span> 
                <div class ="form-check form-switch">

                    <input  <div class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${taskDone && "checked"}  />
                </div >

            </div>

                <div class ="card-body">
                    <span>${taskDescription}</span> 
                    <p class="text-muted"> Task was created ${new Date(taskCreated * 1000).toLocaleString()}</p>

                </div>
            
        </div > `

            html += taskElement;

        }

        document.querySelector('#tasksList').innerHTML = html;
    },

    createTask: async (title, description) => {
        try {
            const result = await App.tasksContract.createTask(title, description, {
                from: App.account,
            })
            console.log(result.logs[0].args);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    },

    toggleDone: async (element) => {
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone(taskId, {
            from: App.account,
        });
        window.location.reload();
    },
};