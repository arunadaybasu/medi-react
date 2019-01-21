var Medipedia = artifacts.require("./Medipedia.sol");

contract('Medipedia', async (accounts) => {
    
    it('marks caller as the medipedia manager', async () => {
        const medipedia = await Medipedia.deployed();
        const manager = await medipedia.owner();
        assert.equal(accounts[0], manager);
    });

    it('should update the user status', async () => {
        const medipedia = await Medipedia.deployed();
        await medipedia.setUserStatus(accounts[1],1, {from: accounts[0]})
        
        const status = await medipedia.getUserStatus(accounts[1]);
        
        assert.equal(status, "1","Status code should be 1");
    });

    it('should raise a medical request to two medical providers', async () => {
        const medipedia = await Medipedia.deployed();
        var accs = [accounts[1],accounts[2]];
        await medipedia.setUserStatus(accounts[0],1, {from: accounts[0]})
        await medipedia.setUserStatus(accounts[1],1, {from: accounts[0]})
        await medipedia.setUserStatus(accounts[2],1, {from: accounts[0]})
        await medipedia.addMessageRequest(accounts[0],accs,'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz', {from: accounts[0]})
        
        const _hash1 = await medipedia.getMessageRequestHashUsingProviderAddress(accounts[0],1,accounts[1]);
        const _hash2 = await medipedia.getMessageRequestHash(accounts[1],1);
        const _hash3 = await medipedia.getMessageRequestHash(accounts[2],1);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz', _hash1);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz', _hash2);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz', _hash3);
    });

    it('should have two messages in patient\'s inbox', async () => {
        const medipedia = await Medipedia.deployed();
        const noOfRequests = await medipedia.getNoOfMsgs(accounts[0]);
        assert.equal("2", noOfRequests, 'Number of message requests should be 2');
    });

    it('should get a reply from a medical provider', async () => {

        const medipedia = await Medipedia.deployed();
        var accs = [accounts[1]];
        await medipedia.setUserStatus(accounts[0],1, {from: accounts[0]})
        await medipedia.setUserStatus(accounts[1],1, {from: accounts[0]})

        await medipedia.addReplies(accounts[0],accs,
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz',
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply', {from: accounts[0]})
        
        const hash = await medipedia.getMessageCommunicationHash(accounts[0],1);
        const _hash1 = await medipedia.getMessageCommunicationHash(accounts[1],1);

        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply', hash);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply', _hash1);
    });

    it('should get replies from two medical provider', async () => {

        const medipedia = await Medipedia.deployed();
        var accs = [accounts[1]];

        await medipedia.addReplies(accounts[0],accs,
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz',
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-01', {from: accounts[0]})
        await medipedia.addReplies(accounts[0],[accounts[2]],
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz',
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-02', {from: accounts[0]})
        
        const hash = await medipedia.getMessageCommunicationHash(accounts[0],1);
        const _hash1 = await medipedia.getMessageCommunicationHash(accounts[1],1);
        const _hash2 = await medipedia.getMessageCommunicationHash(accounts[2],1);

        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-01', hash);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-01', _hash1);
        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-02', _hash2);
    });

    it('should send a reply against a medical request', async () => {

        const medipedia = await Medipedia.deployed();
        var accs = [accounts[1]];
        await medipedia.setUserStatus(accounts[0],1, {from: accounts[0]})
        await medipedia.setUserStatus(accounts[1],1, {from: accounts[0]})

        await medipedia.addReplies(accounts[0],accs,
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz',
                'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply', {from: accounts[0]})
        
        const hash = await medipedia.getMessageCommunicationHash(accounts[0],1);

        assert.equal('zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply', hash);
    });   
    
    it('should return correct number of medical requests', async () => {
        const medipedia = await Medipedia.deployed();

        var accs = [accounts[4]];
        await medipedia.setUserStatus(accounts[5],1, {from: accounts[0]})
        await medipedia.setUserStatus(accounts[4],1, {from: accounts[0]})
        await medipedia.addMessageRequest(accounts[5],accs,'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-01', {from: accounts[0]})
        await medipedia.addMessageRequest(accounts[5],accs,'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-02', {from: accounts[0]})

        await medipedia.addReplies(accounts[5],accs,
            'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-01',
            'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-01', {from: accounts[0]})
        
        await medipedia.addReplies(accounts[5],accs,
            'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-02',
            'zb2rhXtkWZ4L2fhQDLMQsohXs5EvuaT1pXkxfxoqbN5aB98Jz-Reply-02', {from: accounts[0]})
        
        const noOfRequests = await medipedia.getNoOfMsgs(accounts[5]);
        assert.equal("2", noOfRequests, 'Number of message requests should be 2');
    }); 
    /*


    
    */
  });
