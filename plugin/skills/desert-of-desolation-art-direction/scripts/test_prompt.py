#!/usr/bin/env python3
import unittest, copy
from compile_prompt import compile_packet
BASE={'mode':'DOD_INK','module_edition':'Design fixture, not a source encounter','node_id':'fixture.camp','asset_id':'fixture.art','source_refs':['Approved generic maintenance fixture'],'source_reviewed':True,'player_visible_reviewed':True,'visible_details':'An unoccupied desert campfire with two travel packs.','camera':'Eye level, fixed wide view.','continuity':'No specific player or NPC depicted.','actor_state':'none'}
class PromptTests(unittest.TestCase):
    def test_ink(self):self.assertIn('pen-and-ink',compile_packet(BASE)['prompt'])
    def test_painted(self):p={**BASE,'mode':'DOD_PAINTED'};self.assertIn('hand-painted',compile_packet(p)['prompt'])
    def test_not_generated(self):self.assertFalse(compile_packet(BASE)['available'])
    def test_no_mutation(self):p=copy.deepcopy(BASE);before=copy.deepcopy(p);compile_packet(p);self.assertEqual(p,before)
    def test_source_review(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'source_reviewed':False})
    def test_visible_review(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'player_visible_reviewed':False})
    def test_no_refs(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'source_refs':[]})
    def test_missing_scene(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'visible_details':''})
    def test_legacy(self):
        for phrase in ['phosphor-green','pixel art','nearest-neighbor','ordered dithering','320x200','#37A85D']:
            with self.subTest(phrase=phrase), self.assertRaises(ValueError):compile_packet({**BASE,'continuity':phrase})
    def test_unknown_field(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'raw_workbook_prompt':'legacy'})
    def test_death_gate(self):
        for state in ['dying','dead']:
            with self.subTest(state=state), self.assertRaises(ValueError):compile_packet({**BASE,'actor_state':state})
    def test_dead(self):self.assertIn('Static confirmed',compile_packet({**BASE,'actor_state':'dead','lethal_event_confirmed':True})['prompt'])
    def test_attack_not_hit(self):self.assertIn('does not assert a hit',compile_packet({**BASE,'actor_state':'attack'})['prompt'])
    def test_bad_mode(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'mode':'GREEN'})
    def test_bad_subjects(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'subjects':['']})
    def test_unknown_state(self):
        with self.assertRaises(ValueError):compile_packet({**BASE,'actor_state':'resurrected'})
if __name__=='__main__':unittest.main(verbosity=2)
