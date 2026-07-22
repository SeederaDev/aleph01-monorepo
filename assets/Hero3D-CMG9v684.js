import{r as Ae,j as Ze}from"./index-DQEMN6nb.js";import{I as $e,F as Me,a as se,b as W,W as Ke,B as re,S as Ce,V as w,c as Qe,d as Y,U as Te,e as Oe,f as J,M as Re,g as j,L as et,h as tt,i as nt,j as it,P as ot,k as st,A as rt,D as at,G as ct,l as dt,m as lt,n as ft,R as ut}from"./three.module-Ciy6ecsj.js";const Ue=new re,q=new w;class We extends $e{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],i=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],o=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(o),this.setAttribute("position",new Me(e,3)),this.setAttribute("uv",new Me(i,2))}applyMatrix4(e){const i=this.attributes.instanceStart,o=this.attributes.instanceEnd;return i!==void 0&&(i.applyMatrix4(e),o.applyMatrix4(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const o=new se(i,6,1);return this.setAttribute("instanceStart",new W(o,3,0)),this.setAttribute("instanceEnd",new W(o,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));const o=new se(i,6,1);return this.setAttribute("instanceColorStart",new W(o,3,0)),this.setAttribute("instanceColorEnd",new W(o,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ke(e.geometry)),this}fromLineSegments(e){const i=e.geometry;return this.setPositions(i.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new re);const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;e!==void 0&&i!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Ue.setFromBufferAttribute(i),this.boundingBox.union(Ue))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ce),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,i=this.attributes.instanceEnd;if(e!==void 0&&i!==void 0){const o=this.boundingSphere.center;this.boundingBox.getCenter(o);let r=0;for(let c=0,a=e.count;c<a;c++)q.fromBufferAttribute(e,c),r=Math.max(r,o.distanceToSquared(q)),q.fromBufferAttribute(i,c),r=Math.max(r,o.distanceToSquared(q));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}J.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Oe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Y.line={uniforms:Te.merge([J.common,J.fog,J.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Ie extends Qe{constructor(e){super({type:"LineMaterial",uniforms:Te.clone(Y.line.uniforms),vertexShader:Y.line.vertexShader,fragmentShader:Y.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const ne=new j,Le=new w,De=new w,u=new j,p=new j,A=new j,ie=new w,oe=new tt,h=new et,Be=new w,k=new re,X=new Ce,M=new j;let U,P;function Pe(f,e,i){return M.set(0,0,-e,1).applyMatrix4(f.projectionMatrix),M.multiplyScalar(1/M.w),M.x=P/i.width,M.y=P/i.height,M.applyMatrix4(f.projectionMatrixInverse),M.multiplyScalar(1/M.w),Math.abs(Math.max(M.x,M.y))}function pt(f,e){const i=f.matrixWorld,o=f.geometry,r=o.attributes.instanceStart,c=o.attributes.instanceEnd,a=Math.min(o.instanceCount,r.count);for(let s=0,y=a;s<y;s++){h.start.fromBufferAttribute(r,s),h.end.fromBufferAttribute(c,s),h.applyMatrix4(i);const g=new w,m=new w;U.distanceSqToSegment(h.start,h.end,m,g),m.distanceTo(g)<P*.5&&e.push({point:m,pointOnLine:g,distance:U.origin.distanceTo(m),object:f,face:null,faceIndex:s,uv:null,uv1:null})}}function ht(f,e,i){const o=e.projectionMatrix,c=f.material.resolution,a=f.matrixWorld,s=f.geometry,y=s.attributes.instanceStart,g=s.attributes.instanceEnd,m=Math.min(s.instanceCount,y.count),v=-e.near;U.at(1,A),A.w=1,A.applyMatrix4(e.matrixWorldInverse),A.applyMatrix4(o),A.multiplyScalar(1/A.w),A.x*=c.x/2,A.y*=c.y/2,A.z=0,ie.copy(A),oe.multiplyMatrices(e.matrixWorldInverse,a);for(let E=0,Z=m;E<Z;E++){if(u.fromBufferAttribute(y,E),p.fromBufferAttribute(g,E),u.w=1,p.w=1,u.applyMatrix4(oe),p.applyMatrix4(oe),u.z>v&&p.z>v)continue;if(u.z>v){const L=u.z-p.z,d=(u.z-v)/L;u.lerp(p,d)}else if(p.z>v){const L=p.z-u.z,d=(p.z-v)/L;p.lerp(u,d)}u.applyMatrix4(o),p.applyMatrix4(o),u.multiplyScalar(1/u.w),p.multiplyScalar(1/p.w),u.x*=c.x/2,u.y*=c.y/2,p.x*=c.x/2,p.y*=c.y/2,h.start.copy(u),h.start.z=0,h.end.copy(p),h.end.z=0;const z=h.closestPointToPointParameter(ie,!0);h.at(z,Be);const C=nt.lerp(u.z,p.z,z),T=C>=-1&&C<=1,F=ie.distanceTo(Be)<P*.5;if(T&&F){h.start.fromBufferAttribute(y,E),h.end.fromBufferAttribute(g,E),h.start.applyMatrix4(a),h.end.applyMatrix4(a);const L=new w,d=new w;U.distanceSqToSegment(h.start,h.end,d,L),i.push({point:d,pointOnLine:L,distance:U.origin.distanceTo(d),object:f,face:null,faceIndex:E,uv:null,uv1:null})}}}class mt extends Re{constructor(e=new We,i=new Ie({color:Math.random()*16777215})){super(e,i),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,i=e.attributes.instanceStart,o=e.attributes.instanceEnd,r=new Float32Array(2*i.count);for(let a=0,s=0,y=i.count;a<y;a++,s+=2)Le.fromBufferAttribute(i,a),De.fromBufferAttribute(o,a),r[s]=s===0?0:r[s-1],r[s+1]=r[s]+Le.distanceTo(De);const c=new se(r,2,1);return e.setAttribute("instanceDistanceStart",new W(c,1,0)),e.setAttribute("instanceDistanceEnd",new W(c,1,1)),this}raycast(e,i){const o=this.material.worldUnits,r=e.camera;r===null&&!o&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const c=e.params.Line2!==void 0&&e.params.Line2.threshold||0;U=e.ray;const a=this.matrixWorld,s=this.geometry,y=this.material;P=y.linewidth+c,s.boundingSphere===null&&s.computeBoundingSphere(),X.copy(s.boundingSphere).applyMatrix4(a);let g;if(o)g=P*.5;else{const v=Math.max(r.near,X.distanceToPoint(U.origin));g=Pe(r,v,y.resolution)}if(X.radius+=g,U.intersectsSphere(X)===!1)return;s.boundingBox===null&&s.computeBoundingBox(),k.copy(s.boundingBox).applyMatrix4(a);let m;if(o)m=P*.5;else{const v=Math.max(r.near,k.distanceToPoint(U.origin));m=Pe(r,v,y.resolution)}k.expandByScalar(m),U.intersectsBox(k)!==!1&&(o?pt(this,i):ht(this,r,i))}onBeforeRender(e){const i=this.material.uniforms;i&&i.resolution&&(e.getViewport(ne),this.material.uniforms.resolution.value.set(ne.z,ne.w))}}function yt(){const f=Ae.useRef(null);return Ae.useEffect(()=>{const e=f.current;if(!e)return;const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let o=e.clientWidth||1,r=e.clientHeight||1;const c=new it,a=new ot(135.8,o/r,.1,100);a.position.z=6;const s=new st({antialias:!0,alpha:!0});s.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.setSize(o,r),e.appendChild(s.domElement),c.add(new rt(16777215,.75));const y=new at(16777215,.9);y.position.set(3,4,5),c.add(y);const g=[];for(let n=0;n<16;n++)g.push([n&1?1:-1,n&2?1:-1,n&4?1:-1,n&8?1:-1]);const m=[];for(let n=0;n<16;n++)for(let t=n+1;t<16;t++){const l=n^t;l&l-1||m.push([n,t])}const v=Array.from({length:16},()=>[]);m.forEach(([n,t])=>{v[n].push(t),v[t].push(n)});const E=2961203,Z=10132122,_=new ct,z=new Float32Array(m.length*2*3),C=new We,T=new Ie({color:11250603,linewidth:2,transparent:!0,opacity:.8});T.resolution.set(o,r);const F=new mt(C,T);F.frustumCulled=!1,_.add(F);const L=new dt(.04,18,18),d=[];for(let n=0;n<16;n++){const t=new lt({color:E,roughness:1,metalness:0}),l=new Re(L,t);d.push(l),_.add(l)}c.add(_);const I=Array.from({length:16},()=>new w),ae=new Array(16).fill(1),D=Array.from({length:16},()=>new w),ce=Array.from({length:16},()=>new w),je=2.6,$=2;function de(n,t){const l=Math.cos(n),x=Math.sin(n),b=Math.cos(t),R=Math.sin(t);for(let B=0;B<16;B++){const[be,Ee,ke,_e]=g[B],Xe=be*l-_e*x,ze=be*x+_e*l,Ye=Ee*b-ze*R,Je=Ee*R+ze*b,V=1/(je-Je);I[B].set(Xe*V*$,Ye*V*$,ke*V*$),ae[B]=.8+V*.9}}const Fe=16,He=7;let K=3;function le(){const n=a.position.z*Math.tan(a.fov*Math.PI/360),t=n*a.aspect;K=Math.min(n,t)*.9}function Ne(n){for(let t=0;t<16;t++){if(t===S)continue;const l=D[t],x=ce[t],b=l.clone().multiplyScalar(-34);for(const R of v[t])b.add(D[R].clone().sub(l).multiplyScalar(Fe));x.addScaledVector(b,n),x.multiplyScalar(Math.max(0,1-He*n)),l.addScaledVector(x,n)}}function fe(){let n=0;for(let t=0;t<16;t++){const l=I[t].x+D[t].x,x=I[t].y+D[t].y,b=I[t].z+D[t].z;d[t].position.set(l,x,b);const R=1+D[t].length()*.12,B=ae[t]*R*(t===S?1.3:1);d[t].scale.setScalar(B)}for(const[t,l]of m){const x=d[t].position,b=d[l].position;z[n++]=x.x,z[n++]=x.y,z[n++]=x.z,z[n++]=b.x,z[n++]=b.y,z[n++]=b.z}C.setPositions(z)}let ue=0,pe=0;const Ge=n=>{const t=e.getBoundingClientRect();ue=(n.clientX-t.left)/t.width-.5,pe=(n.clientY-t.top)/t.height-.5},H=new ut,N=new Oe,he=new ft,me=new w;let S=-1,ve=-1;function we(n){const t=s.domElement.getBoundingClientRect();N.x=(n.clientX-t.left)/t.width*2-1,N.y=-((n.clientY-t.top)/t.height)*2+1}function ye(n){we(n),H.setFromCamera(N,a);const t=H.intersectObjects(d,!1);return t.length?d.indexOf(t[0].object):-1}function ge(n){const t=ye(n);if(t===-1)return;S=t,ce[t].set(0,0,0),d[t].material.color.setHex(Z),d[t].material.depthTest=!1,d[t].renderOrder=999;const l=new w;a.getWorldDirection(l),he.setFromNormalAndCoplanarPoint(l,d[t].getWorldPosition(new w)),document.body.style.cursor="grabbing",qe(),n.preventDefault()}function Se(n){if(Ge(n),S===-1){const t=ye(n);t!==ve&&(ve=t,document.body.style.cursor=t===-1?"":"grab");return}if(we(n),H.setFromCamera(N,a),H.ray.intersectPlane(he,me)){const t=_.worldToLocal(me.clone());t.length()>K&&t.setLength(K),D[S].copy(t.clone().sub(I[S]))}n.preventDefault()}function G(){S!==-1&&(d[S].material.color.setHex(E),d[S].material.depthTest=!0,d[S].renderOrder=0,S=-1,document.body.style.cursor="")}window.addEventListener("pointerdown",ge),window.addEventListener("pointermove",Se),window.addEventListener("pointerup",G),window.addEventListener("pointercancel",G);let O=0,Q=0,ee=performance.now();const Ve=()=>S===-1&&D.every(n=>n.lengthSq()<1e-6),te=n=>{const t=Math.min((n-ee)/1e3,.03333333333333333);ee=n,i||(Q+=.006,_.rotation.y+=.0035,_.rotation.x+=(pe*.6-_.rotation.x)*.05,_.rotation.z+=(ue*.4-_.rotation.z)*.05),de(Q*.7,Q*.45),Ne(t),fe(),s.render(c,a),!i||!Ve()?O=requestAnimationFrame(te):O=0},qe=()=>{O||(ee=performance.now(),O=requestAnimationFrame(te))};le(),de(.4,.2),fe(),s.render(c,a),O=requestAnimationFrame(te);const xe=()=>{o=e.clientWidth||1,r=e.clientHeight||1,a.aspect=o/r,a.updateProjectionMatrix(),s.setSize(o,r),T.resolution.set(o,r),le()};return window.addEventListener("resize",xe),()=>{cancelAnimationFrame(O),window.removeEventListener("resize",xe),window.removeEventListener("pointerdown",ge),window.removeEventListener("pointermove",Se),window.removeEventListener("pointerup",G),window.removeEventListener("pointercancel",G),(document.body.style.cursor==="grab"||document.body.style.cursor==="grabbing")&&(document.body.style.cursor=""),C.dispose(),T.dispose(),L.dispose(),d.forEach(n=>n.material.dispose()),s.dispose(),s.domElement.parentNode&&s.domElement.parentNode.removeChild(s.domElement)}},[]),Ze.jsx("div",{className:"hero3d",ref:f,"aria-hidden":"true"})}export{yt as default};
