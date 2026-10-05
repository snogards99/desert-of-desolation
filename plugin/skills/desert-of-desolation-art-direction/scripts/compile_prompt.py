#!/usr/bin/env python3
"""Compile a private authoring packet, not arbitrary legacy workbook prompts.
The reviewed flags are author attestations, NOT independent canon verification.
"""
import argparse, json, re
from pathlib import Path
STYLE={
 'DOD_INK': 'Original expressive black-and-white fantasy pen-and-ink illustration informed by the approved Jim Holloway reference sheet. Black contours, selective hatching, strong black shapes, readable gestures and negative space on lightly warm paper. No painted grayscale or airbrushed shading.',
 'DOD_PAINTED': 'Original hand-painted Desert of Desolation presentation illustration informed by the supplied original module covers. Broad midnight-blue masses, violet shadow, restrained aged gold, spectral turquoise, controlled dramatic light, ancient scale and human vulnerability. No glossy CGI, neon or photographic skin.'
}
LEGACY=re.compile(r'phosphor|nearest.neighbou?r|pixel.art|ordered dither|320\s*[xX]\s*200|#(?:124524|37A85D|A1F2B0)',re.I)
def compile_packet(packet):
    if not isinstance(packet,dict): raise ValueError('Packet must be an object')
    allowed={'mode','module_edition','node_id','source_refs','source_reviewed','player_visible_reviewed','visible_details','camera','continuity','exclude','actor_state','lethal_event_confirmed','asset_id','negative_space','subjects'}
    unknown=set(packet)-allowed
    if unknown: raise ValueError('Unknown fields (map source data explicitly): '+', '.join(sorted(unknown)))
    for key in ['module_edition','node_id','asset_id','visible_details','camera','continuity']:
        if not isinstance(packet.get(key),str) or not packet[key].strip(): raise ValueError(f'Missing {key}')
    mode=packet.get('mode','DOD_INK')
    if mode not in STYLE: raise ValueError('Unsupported style mode')
    if packet.get('source_reviewed') is not True or packet.get('player_visible_reviewed') is not True:
        raise ValueError('Source and player-visible review attestations required')
    refs=packet.get('source_refs')
    if not isinstance(refs,list) or not refs or not all(isinstance(x,str) and x.strip() for x in refs): raise ValueError('Specific source references required')
    if LEGACY.search(json.dumps(packet)): raise ValueError('Legacy palette/pixel instruction detected; reconstruct source facts instead')
    actor_state=packet.get('actor_state','none')
    if actor_state not in ['none','normal','attack','dying','dead']: raise ValueError('Unknown actor state')
    if actor_state in ['dying','dead'] and packet.get('lethal_event_confirmed') is not True: raise ValueError('Death imagery needs a confirmed lethal event')
    subjects=packet.get('subjects',[])
    if not isinstance(subjects,list) or not all(isinstance(x,str) and x.strip() for x in subjects): raise ValueError('Subjects must be reviewed descriptions')
    for key in ['exclude','negative_space']:
        if key in packet and not isinstance(packet[key],str): raise ValueError(f'{key} must be text')
    state_rule={'none':'Do not invent occupants.','normal':'Show only currently disclosed subjects.','attack':'An attack pose does not assert a hit, injury or death.','dying':'Use the confirmed event only; never imply harm to surviving instances.','dead':'Static confirmed remains or source-supported absence; no breathing, revival or alive fallback.'}[actor_state]
    lines=[STYLE[mode],f"Scene: {packet['visible_details']}",f"Subjects: {', '.join(subjects) if subjects else 'none specified; do not add any'}",f"Camera: {packet['camera']}",f"Continuity: {packet['continuity']}",f"State: {actor_state}. {state_rule}",f"Negative space: {packet.get('negative_space','keep the focal action readable at mobile size')}",f"Exclude: {packet.get('exclude','all unrevealed information')}. No hidden doors, unseen occupants, treasure reveals, readable puzzle solutions, modern objects, embedded lettering, signatures or watermarks.",'This is new artwork, not an original historical illustration.']
    return {'schema_version':1,'asset_id':packet['asset_id'],'node_id':packet['node_id'],'module_edition':packet['module_edition'],'source_refs':refs,'mode':mode,'prompt':'\n'.join(lines),'status':'GENERATION_PLACEHOLDER','available':False,'runtime_eligible':False,'actual_file':None,'review_basis':'AUTHOR_ATTESTATION_NOT_AUTOMATED_CANON_PROOF'}
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('packet',type=Path);parser.add_argument('--out',type=Path);a=parser.parse_args()
    try: result=compile_packet(json.loads(a.packet.read_text()))
    except (OSError,ValueError,TypeError) as e: parser.exit(2,f'Cannot compile: {e}\n')
    text=json.dumps(result,indent=2)+'\n'
    if a.out:a.out.write_text(text)
    else:print(text,end='')
