const prisma = require('../prisma/db.config.js')

exports.joinOrganization = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.id);
        const userId = parseInt(req.body.userId);
        const role = 'Member';

        if (!userId || !organizationId) {
            console.log('All fields required');
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await prisma.membership.findUnique({
            where: {
                userId_organizationId: { userId, organizationId },
            }
        })

        if (existing) {
            console.log('Already a member');
            return res.status(400).json({ message: 'Already a member' });
        }

        const membership = await prisma.membership.create({
            data: {
                userId,
                organizationId,
                role
            }
        })

        res.status(201).json(membership);
        console.log('User added to organization');

    } catch (err) {
        console.log('Could not add user: ', err);
        return res.status(500).json({ message: 'Could not add user', error: err.message });
    }
}

exports.createOrganization = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || !userId) {
            console.log('All fields required');
            return res.status(400).json({ message: 'All fields are required' });
        }

        const organization = await prisma.organization.create({
            data: {
                name,
            }
        })

        const membership = await prisma.membership.create({
            data: {
                userId,
                organizationId: organization.id,
                role: 'Admin'
            }
        })

        res.status(201).json({ membership, organization });
        console.log('organization created');

    } catch (err) {
        console.log('Could not create organization: ', err);
        return res.status(500).json({ message: 'Could not create organization', error: err.message });
    }
}

exports.getOrganizations = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            console.log('UserId required');
            return res.status(400).json({ message: 'UserId required' });
        }

        const organizations = await prisma.membership.findMany({
            where: { userId },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        res.status(200).json({organizations});
        console.log('organizations fetched successfully');

    } catch (err) {
        console.log("organizations fetch unsuccessful", err)
        return res.status(500).json({ message: 'organizations fetch unsuccessful', error: err.message });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const organizationId = parseInt(req.params.id);

        if (!organizationId) {
            console.log('organizationId required');
            return res.status(400).json({ message: 'organizationId required' });
        }

        const users = await prisma.membership.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        })

        res.status(200).json(users);
        console.log('Users fetched successfully');

    } catch (error) {
        console.log("Users fetch unsuccessful", error)
        return res.status(500).json({ message: 'Users fetch unsuccessful', error: error.message });
    }
}