import { options } from 'preact';
import { vnodesForComponent } from './vnodesForComponent';

const oldVnode = options.vnode;
options.vnode = vnode => {
	if (typeof vnode.type === 'function') {
		const vnodes = vnodesForComponent.get(vnode.type);
		if (!vnodes) {
			vnodesForComponent.set(vnode.type, [vnode]);
		} else {
			vnodes.push(vnode);
		}
	}

	if (oldVnode) oldVnode(vnode);
};
