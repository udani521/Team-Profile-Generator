const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./src/page-template.js");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const teamMembers = [];

const promptManager = async () => {
    const managerData = await inquirer.prompt([
      // Prompt questions for manager
      {
        type: "input",
        name: "name",
        message: "What is the team manager's name?",
      },
      {
        type: "input",
        name: "id",
        message: "What is the team manager's id?",
      },
      {
        type: "input",
        name: "email",
        message: "What is the team manager's email?",
      },
      {
        type: "input",
        name: "officeNumber",
        message: "What is the team manager's office number?",
      },
    ]);
    console.log("Manager data:", managerData);
    const manager = new Manager(managerData.name, managerData.id, managerData.email, managerData.officeNumber);
    teamMembers.push(manager);
  
    // Call a function to prompt for more team members
    await promptTeamMembers();
};

const promptTeamMembers = async () => {
    const { teamMember } = await inquirer.prompt([
        // Prompt for choosing the type of team member to add
        {
            type: "list",
            name: "teamMember",
            message: "Select type of team member to add",
            choices: ["Engineer", "Intern", "None"],
        },
    ]);
  
    switch (teamMember) {
        case 'Engineer':
            // Prompt questions for engineer
            const engineerData = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is the engineer's name?",
                },
                {
                    type: "input",
                    name: "id",
                    message: "What is the engineer's id?",
                },
                {
                    type: "input",
                    name: "email",
                    message: "What is the engineer's email?",
                },
                {
                    type: "input",
                    name: "github",
                    message: "What is the engineer's github?",
                },
            ]);
            const engineer = new Engineer(engineerData.name, engineerData.id, engineerData.email, engineerData.github);
            teamMembers.push(engineer);
            break;
  
        case 'Intern':
            // Prompt questions for intern
            const internData = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is the intern's name?",
                },
                {
                    type: "input",
                    name: "id",
                    message: "What is the intern's id?",
                },
                {
                    type: "input",
                    name: "email",
                    message: "What is the intern's email?",
                },
                {
                    type: "input",
                    name: "school",
                    message: "What is the intern's school?",
                },
            ]);
            const intern = new Intern(internData.name, internData.id, internData.email, internData.school);
            teamMembers.push(intern);
            break;

            case 'None':
  
            // Finish building the team and generate HTML
            const html = render(teamMembers);
            await generateAndWriteHTML(html);
            return;  //exit the function
            
            default:
                // Handle other cases if needed
                break;
    }
  
    // After handling the current team member, prompt for more team members
    await promptTeamMembers();
};

const generateAndWriteHTML = async (html) => {
    // Ensure the output directory exists before attempting to write the file
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    // Use fs.promises.writeFile for asynchronous file writing
    await fs.promises.writeFile(outputPath, html, 'utf-8')
        .then(() => {
            console.log(`Team HTML generated at ${outputPath}`);
        })
        .catch((err) => {
            console.error("Error writing HTML file:", err);
        });
};

// Start the application by prompting for manager details
promptManager();
