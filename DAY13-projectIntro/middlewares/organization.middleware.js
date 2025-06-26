const prisma = require('../prisma/db.config.js')

const restrict = async (req, res, next) => {
    const userId = req.user.id;
    const organizationId = parseInt(req.params.id);

    if (!organizationId) {
        console.log('Missing organization ID in route params.')
        return res.status(400).json({ message: 'Missing organization ID in route params.' });
    }

    try {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            }
        })

        if(!membership){
            console.log('User not part of the organization')
            return res.status(400).json({message : 'User not part of the organization'})
        }

        if(membership.role==='Manager' || membership.role==='Admin'){
            console.log('Access allowed')
            return next();
        }

        console.log('Access denied: Admins or Managers only.')
        return res.status(403).json({message : 'Access denied: Admins or Managers only.'})

    } catch (err) {
        console.log('Role identification issue')
        return res.status(500).json({ message: 'Role identification issue', err });
    }
}

module.exports = restrict;