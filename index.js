/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just hack it…
I need this code, but don't know where, perhaps should make some middleware, don't worry, just hack it

Go code!
*/

const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const projectDb = require('./data/helpers/projectModel');
const actionDb = require('./data/helpers/actionModel');

server.get('./api/actions', (req, res) => {
    try{
        actionDb.get()
        .then(actions => res.send(actions));
    } catch {
        res.status(500).json({ error: 'an error has occurred'})
    }
});

server.get('/api/actions/:id', validateActionId, (req, res) =>{
    try{
        actionDb.get(req.post)
        .then(action => res.send(action));
    } catch{
        res.status(500).json({ error: 'an error has occurred'});
    }
});

server.post('/api/actions', validateAction, (req, res) => {
    try{
        const newAction = {
            project_id: req.body.project_id,
            description: req.body.description,
            notes: req.body.notes,
            completed: req.body.completed
        }
        actionDb.insert(newAction)
        .then(action => res.status(201).send(action));
    } catch{
        res.status(500).json({ error:"an error has occurred"});
    }
});

server.put('/api/actions/:id', validateActionId, validateAction, (req, res) =>{
    try{
        const updateAction ={
            project_id: req.body.project_id,
            description: req.body.description,
            notes: req.body.notes,
            completed: req.body.completed
        }
        actionDb.update(req.post, updateAction)
        .then(action => res.send(action));
    } catch {
        res.status(500).json({error: ' an error has occurred'})
    }
});

server.delete('/api/actions/:id', validateAction, (req, res) =>{
    try{
        actionsDb.remove(req.post)
        .then(res => res.sendStatus(204));
    } catch{
        res.status(500).json({ error: ' an error has occurred'})
    }
});

server.get('/api/projects', (req, res) => {
    try{
        projectDb.get()
        .then(projects => res.send(projects));
    } catch {
        res.status(500).json({ error: 'an error has occurred'});
    }
});

server.get('/api/projects/:id', validateProjectId, (req, res) => {
    try{
        projectDb.get()
        .then(projects => res.send(projects));
    } catch{
        res.status(500).json({error: ' an error has occurred'})
    }
})

server.post('/api/projects', validateProject, (req, res) => {
    try{
        const newProject ={
            name: req.body.name,
            description: req.body.description
        }
        projectDb.insert(newProject)
        .then(project => res.status(201).json({ message: ' project was successfully created'}))
    }catch {
        res.status(500).json({ error: 'an error has occurred'})
    }
});

server.put('/api/projects/:id', validateProjectId, validateProject, (req, res) => {
    try{
        const updateProject = {
            name: req.body.name,
            description: req.body.description
        }
        projectDb.update(req.posy, updateProject)
        .then(project => res.send(project));
    } catch{
        res.status(500).json({ error: ' an error has occurred'})
    }
});

server.delete('/api/projects/:id', validateProjectId, (req, res) => {
    try{
        projectDb.remove(req.post)
        .then(res => res.sendStatus(204));
    } catch{
        res.status(500).json({ error: ' an error has occurred'})
    }
});

server.get('/api/projects/:id/actions', validateProjectId, (req, res) => {
    try{
        projectDb.getProjectActions(req.post)
        .then(actions => res.send(actions));
    } catch {
        res.status(500).json({ error: ' an error has occurred'})
    }
});

server.use(function(req, res){
    res.status(404).send('Not A Route')
});

function validateActionId(req, res, next){
    const id = req.params.id;
    actionDb.get(id)
    .then(action => {
        if(action){
            req.post = req.params.id;
            next();
        } else{
            res.status(400).json({ message: ' invalid action id'});
        }
    })
}

function validateProjectId(req, res, next){
    const id = req.params.id;
    projectDb.get(id)
    .then(project => {
        if(project){
            req.post = req.params.id;
            next();
        } else {
            res.status(400).json({ message: " invalid project id"});
        }
    })
}

function validateProject( req, res, next){
    if(req.body.name && req.body.description){
        next();
    } else {
        res.status(400).json({ message: ' missing required'})
    }
}

function validateAction( req, res, next){
    if(req.body.project_id && req.body.description && req.body.notes){
        next();
    }else {
        res.status(400).json({ message: 'missing required'})
    }
}

const port = process.env.PORT || 4005;
server.listen(port, () => console.log(`****Server listening on ${port}****`))